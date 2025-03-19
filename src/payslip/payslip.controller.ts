import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PayrollService } from './providers/payslip.service';
import { CreatePayrollSummaryDto } from './dtos/createPayslip.dto';
import { UpdatePayrollSummaryDto } from './dtos/updatePayslip.dto';
import { CreateIncomeDetailsDto } from './dtos/createIncome.dto';
import { UpdateIncomeDetailsDto } from './dtos/updateIncome.dto';

@Controller('payroll')
export class PayslipController {
  constructor(private readonly payrollService: PayrollService) {}

  // Create a new payroll summary with income details
  @Post()
  async create(
    @Body('payroll') createPayrollDto: CreatePayrollSummaryDto,
    @Body('income') incomeDetails: CreateIncomeDetailsDto[],
  ) {
    if (!Array.isArray(incomeDetails)) {
      throw new BadRequestException('Income details must be an array');
    }
    return this.payrollService.create(createPayrollDto, incomeDetails);
  }

  // Get a single payroll summary by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.payrollService.findOne(id);
  }

  // Get all payroll summaries
  @Get()
  async findAll() {
    return this.payrollService.findAll();
  }

  // Update a payroll summary and its income details
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('payroll') updatePayrollDto: UpdatePayrollSummaryDto,
    @Body('income') updateIncomeDto: UpdateIncomeDetailsDto[],
  ) {
    return this.payrollService.update(id, updatePayrollDto, updateIncomeDto);
  }

  // Delete a payroll summary and its associated income details
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.payrollService.remove(id);
  }
}
