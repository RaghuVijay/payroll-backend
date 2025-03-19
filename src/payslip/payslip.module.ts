import { Module } from '@nestjs/common';
import { PayrollService } from './providers/payslip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollSummary } from './payslip.entity';
import { IncomeDetails } from './incomeDetails.entity';
import { PayslipController } from './payslip.controller';

@Module({
  providers: [PayrollService],
  imports: [TypeOrmModule.forFeature([PayrollSummary, IncomeDetails])],
  controllers: [PayslipController],
  exports: [PayrollService],
})
export class PayslipModule {}
