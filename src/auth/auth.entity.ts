// src/auth/entities/user-creds.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Unique,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserRoles } from 'src/roles/roles.entity';
import { UserInfo } from 'src/users/users.entity';

@Entity('user_creds')
@Unique(['email']) // Ensure email uniqueness
export class UserCreds {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    default: () => "CONCAT('CRED', LPAD(nextval('cred_seq')::text, 4, '0'))",
  })
  code: string;

  @Column({ type: 'varchar', length: 255, unique: true }) // Ensure email is unique
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ManyToOne(() => UserRoles, (userRole) => userRole.code)
  @JoinColumn({ name: 'role_code', referencedColumnName: 'code' })
  role: UserRoles;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.userCreds)
  @JoinColumn({ name: 'id', referencedColumnName: 'cred_code' })
  userInfo: UserInfo;
}
