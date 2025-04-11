import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Payload } from 'src/interfaces/payload';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: Payload) {
    createTodoDto.user_id = req.payload.user_id
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll(@Req() req: Payload) {
    return this.todosService.findAll(req.payload.user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, req: Payload) {
    return this.todosService.findOne(+id, req.payload.user_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @Req() req: Payload) {
    updateTodoDto.user_id = req.payload.user_id
    return this.todosService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, req: Payload) {
    return this.todosService.remove(+id, req.payload.user_id);
  }
}
