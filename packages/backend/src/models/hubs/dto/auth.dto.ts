import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description:
      'El nombre del usuario correspondiente al correo institucional (pepe.palote@abe.bo)',
    example: 'pepe.palote',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password LDAP integrado al correo institucional',
    example: 'passwordpalote@123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
