// src/income/entities/income-details.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PayrollSummary } from './payslip.entity';
import { IncomeType } from './enums/income-type.enum';

@Entity('income_details')
export class IncomeDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    default: () => `'INC' || TO_CHAR(NEXTVAL('inc_seq'), 'FM0000')`,
  })
  code: string;

  @Column({ type: 'varchar', length: 10 })
  summary_code: string;

  @ManyToOne(() => PayrollSummary, (summary) => summary.incomeDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'summary_code', referencedColumnName: 'code' })
  summary: PayrollSummary;

  @Column({ type: 'enum', enum: IncomeType })
  type: IncomeType;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Fixed type
  amount: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
