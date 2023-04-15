import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApiException {
  @ApiPropertyOptional() statusCode?: number;
  @ApiPropertyOptional() message?: string;
}
