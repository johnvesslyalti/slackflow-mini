export class CreateRequestDto {
  customerId!: string;
  title!: string;
  description?: string;
}

export class AcceptRequestDto {
  requestId!: string;
  agentId!: string;
}

export class ResolveRequestDto {
  requestId!: string;
}
