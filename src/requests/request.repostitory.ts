import { Injectable } from "@nestjs/common";
import { RequestStatus } from "./request-status.enum";
import { PrismaService } from "src/prisma/prisma.service";

export interface RequestEntity {
    id: string;
    customerId: string;
    title: string;
    description: string;
    status: RequestStatus;
    agentId?: string;
    createdAt: Date;
}

@Injectable()
export class RequestsRepository {
    constructor(private prisma: PrismaService) {}

    async create(data: {
        custormerId: string,
        title: string,
        description: string,
    }) {
        return this.prisma.request.create({
            data: {
                ...data,
                status: 'OPEN'
            }
        })
    }

    async findById(id: string) {
        return this.prisma.request.findUnique({
            where: {id}
        })
    }

    async update(id: string, data: {
        status: RequestStatus,
        agentId?: string,
    }) {
        return this.prisma.request.update({
            where: {id},
            data,
        })
    }

    async markAccepted(requestId : string, agentId: string) {
        return this.update(requestId, {
            status: RequestStatus.ACCEPTED,
            agentId,
        })
    }
}