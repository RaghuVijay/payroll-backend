// src/payroll/entities/payroll-summary.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserInfo } from 'src/users/users.entity';
import { IncomeDetails } from './incomeDetails.entity';

@Entity('payroll_summary')
export class PayrollSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    default: () => `'SMR' || TO_CHAR(NEXTVAL('smr_seq'), 'FM0000')`,
  })
  code: string;

  @Column({ type: 'varchar', length: 10 })
  user_code: string;

  @ManyToOne(() => UserInfo, (user) => user.payrollSummaries)
  @JoinColumn({ name: 'user_code', referencedColumnName: 'code' }) // Match DB schema
  user: UserInfo;

  @OneToMany(() => IncomeDetails, (income) => income.summary, { cascade: true })
  incomeDetails: IncomeDetails[];

  @Column({ type: 'date' })
  pay_period: Date;

  @Column({ type: 'int' })
  paid_days: number;

  @Column({ type: 'int' })
  loss_of_pay_days: number;

  @Column({ type: 'date' })
  pay_date: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
