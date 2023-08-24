import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description:
      'El nombre del usuario correspondiente al correo institucional (pepe.palote@abe.bo)',
    example: 'adrian.rojas',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password LDAP integrado al correo institucional',
    example: 'adrian.rojas@abe.bo',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
