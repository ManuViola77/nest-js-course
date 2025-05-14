import { Task } from '../tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // eager: true is to automatically include tasks when we fetch user, no need to make another extra call
  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
