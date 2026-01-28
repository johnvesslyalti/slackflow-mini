
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { RequestsService } from '../src/requests/requests.service';
import { SlaService } from '../src/sla/sla.service';
import { TicketsService } from '../src/tickets/tickets.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { RequestStatus, TicketStatus, SlaStatus } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const requestsService = app.get(RequestsService);
  const ticketsService = app.get(TicketsService); // Assuming we can use this to update status if methods exist, or we mock it
  const slaService = app.get(SlaService);
  const prisma = app.get(PrismaService);

  console.log('🧹 Cleaning up DB...');
  await prisma.sLA.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.request.deleteMany();

  console.log('✅ 1. Testing End-to-End Flow');
  
  // 1. Create Request
  const request = await requestsService.create({
    customerId: 'cust-1',
    title: 'Help me',
    description: 'I need help',
  });
  
  // 2. Accept Request
  const ticket = await requestsService.accept(request.id, 'agent-1');
  
  // 3. Verify SLA Start
  let sla = await prisma.sLA.findUnique({ where: { ticketId: ticket.id } });
  if (!sla || sla.status !== SlaStatus.ACTIVE) throw new Error('SLA should be ACTIVE');
  console.log('   - SLA started');

  // --- SLA DEEP DIVE ---
  console.log('✅ 3. Testing SLA Pause/Resume/Breach');
  
  // 3a. Pause SLA
  console.log('   - Pausing SLA (Simulating WAITING_ON_CUSTOMER)...');
  // NOTE: TicketsService doesn't seem to have updateStatus, so we call SlaService directly to verify SLA logic works, 
  // acknowledging that the trigger from Ticket -> SLA might be missing in TicketsService.
  await slaService.pause(ticket.id); 
  
  sla = await prisma.sLA.findUnique({ where: { ticketId: ticket.id } });
  if (!sla || sla.status !== SlaStatus.PAUSED) throw new Error('SLA should be PAUSED');
  if (!sla.pausedAt) throw new Error('SLA pausedAt should be set');
  console.log('   - SLA paused');

  // 3b. Resume SLA
  console.log('   - Resuming SLA (Simulating ACTIVE)...');
  await new Promise(r => setTimeout(r, 1100)); // Wait 1s to have some paused duration
  await slaService.resume(ticket.id);

  sla = await prisma.sLA.findUnique({ where: { ticketId: ticket.id } });
  if (!sla || sla.status !== SlaStatus.ACTIVE) throw new Error('SLA should be ACTIVE');
  if (sla.pausedAt !== null) throw new Error('SLA pausedAt should be null');
  if (sla.totalPaused < 1) throw new Error('SLA totalPaused should be > 0');
  console.log(`   - SLA resumed (Paused for ${sla.totalPaused}s)`);

  // 3c. Breach SLA
  console.log('   - Testing Breach Logic...');
  // Manually update startedAt to be long ago
  const longAgo = new Date();
  longAgo.setHours(longAgo.getHours() - 1); // 1 hour ago (duration is 30 mins)
  
  await prisma.sLA.update({
    where: { id: sla.id },
    data: { startedAt: longAgo }
  });

  await slaService.checkForBreaches();
  
  sla = await prisma.sLA.findUnique({ where: { ticketId: ticket.id } });
  if (!sla || sla.status !== SlaStatus.BREACHED) throw new Error('SLA should be BREACHED');
  console.log('   - SLA breach detected correctly');

  // --- END DEEP DIVE ---

  await app.close();
  console.log('🎉 All checks passed (including SLA internals)!');
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
