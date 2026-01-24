import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestsService {
    create(data: any) {
        return {
            id: 'RF-1',
            status: 'OPEN',
            createdAt: new Date(),
            data,
        }
    }
}
