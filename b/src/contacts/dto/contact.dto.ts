import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactMessageDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  googleAccount!: string;

  @ApiProperty({ example: 'Ish taklifi haqida gaplashmoqchiman' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  purpose!: string;
}

export class SendContactEmailDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  to!: string;

  @ApiProperty({ example: 'Javob: Ish taklifi' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subject!: string;

  @ApiProperty({ example: 'Salom! Xabaringizni ko\'rib chiqdim...' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message!: string;
}
