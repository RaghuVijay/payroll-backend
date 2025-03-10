import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Status } from './enums/statusType.enum'; 

@Entity('user_roles')
export class UserRoles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    default: () => "CONCAT('ROLE', LPAD(nextval('role_seq')::text, 4, '0'))",
  })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  role_name: string;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  @DeleteDateColumn()
  deleted_at: Date;
}