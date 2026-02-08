/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUp } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Login } from './dto/login.dto';

@Controller()
export class UsersController {
 constructor(private readonly usersService: UsersService) {}

@Post('signup')
  createUser(@Body() createUserDto: SignUp) {
    return this.usersService.signUp(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginDto: Login) {
    return this.usersService.login(loginDto);
  }

    @Post('googlelogin')
  googleloginUser(@Body() loginDto: Login) {
    return this.usersService.googleLogin(loginDto);
  }

    @Post('githublogin')
  githubloginUser(@Body() loginDto: Login) {
    return this.usersService.githubLogin(loginDto);
  }

  @Get()
  getAllUsers(){
    return this.usersService.getAllusers();
  }

  @Get(":id")
  getUserById(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.usersService.getById(id);
  }

  
  @Patch(":id")
  updateById(@Param("id") id:string , @Body() updateUserDto:UpdateUserDto){
    return this.usersService.updateById(+id , updateUserDto)
  }

  @Delete(":id")
  removeById(@Param("id") id:number){
    return this.usersService.removeById(id)
  }

  @Patch('ban/:id')
  ban(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.banUser(id);
  }

  @Patch('unban/:id')
  unban(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.unbanUser(id);
  }
}