import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectVisitorDto {
  @ApiProperty({ description: 'Unique visitor key from client' })
  @IsString()
  @IsNotEmpty()
  visitorKey!: string;
}
