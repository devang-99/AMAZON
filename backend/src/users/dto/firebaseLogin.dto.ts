/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FirebaseLogin {

  @IsEmail()
  @IsString({ message: 'Email must be a in a proper format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

}