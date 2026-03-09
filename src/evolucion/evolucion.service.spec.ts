import { Test, TestingModule } from '@nestjs/testing';
import { EvolucionService } from './evolucion.service';

describe('EvolucionService', () => {
  let service: EvolucionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvolucionService],
    }).compile();

    service = module.get<EvolucionService>(EvolucionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
