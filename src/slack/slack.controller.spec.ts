import { Test, TestingModule } from '@nestjs/testing';
import { SlackController } from './slack.controller';
import { RequestsService } from 'src/requests/requests.service';

describe('SlackController', () => {
  let controller: SlackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlackController],
      providers: [
        {
          provide: RequestsService,
          useValue: {
            create: jest.fn(),
            accept: jest.fn(),
            resolve: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SlackController>(SlackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
