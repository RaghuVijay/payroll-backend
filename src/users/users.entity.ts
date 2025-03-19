// src/user/entities/user-info.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { PayrollSummary } from 'src/payslip/payslip.entity';
import { UserCreds } from 'src/auth/auth.entity';

@Entity('user_info')
export class UserInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    default: () => `'USER' || TO_CHAR(NEXTVAL('user_seq'), 'FM0000')`,
  })
  code: string;

  @Column({ type: 'varchar', length: 10 })
  cred_code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  surname: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ type: 'varchar' })
  gender: string;

  @Column({ type: 'varchar', length: 10 })
  organization_code: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @OneToMany(() => PayrollSummary, (payrollSummary) => payrollSummary.user, {
    cascade: true,
  })
  payrollSummaries: PayrollSummary[];

  @OneToOne(() => UserCreds, (userCreds) => userCreds.userInfo)
  @JoinColumn({ name: 'cred_code', referencedColumnName: 'code' })
  userCreds: UserCreds;
}
