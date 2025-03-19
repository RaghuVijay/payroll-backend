import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PayrollSummary } from '../payslip.entity';
import { IncomeDetails } from '../incomeDetails.entity';
import { CreatePayrollSummaryDto } from '../dtos/createPayslip.dto';
import { UpdatePayrollSummaryDto } from '../dtos/updatePayslip.dto';
import { CreateIncomeDetailsDto } from '../dtos/createIncome.dto';
import { UpdateIncomeDetailsDto } from '../dtos/updateIncome.dto';
import { IncomeType } from '../enums/income-type.enum';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(PayrollSummary)
    private payrollRepo: Repository<PayrollSummary>,

    @InjectRepository(IncomeDetails)
    private incomeRepo: Repository<IncomeDetails>,

    private readonly connection: DataSource,
  ) {}

  async create(
    createPayrollDto: CreatePayrollSummaryDto,
    incomeDetails: CreateIncomeDetailsDto[],
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create and save the payroll summary
      const payroll = this.payrollRepo.create(createPayrollDto);
      const savedPayroll = await queryRunner.manager.save(payroll);

      // Validate and save multiple income details
      const incomes = incomeDetails.map((income) => {
        console.log('Income:', income); // Debugging
        if (!Object.values(IncomeType).includes(income.type as IncomeType)) {
          throw new BadRequestException(`Invalid income type: ${income.type}`);
        }
        return this.incomeRepo.create({
          ...income,
          summary: savedPayroll,
        });
      });

      await queryRunner.manager.save(incomes);
      await queryRunner.commitTransaction();

      return await this.findOne(savedPayroll.code);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(
        `Failed to create payroll and income details: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string): Promise<PayrollSummary> {
    const payroll = await this.payrollRepo.findOne({
      where: { code: id },
      relations: ['incomeDetails'],
    });
    if (!payroll)
      throw new NotFoundException(`Payroll with ID ${id} not found`);
    return payroll;
  }

  async findAll() {
    const payrolls = await this.payrollRepo.find({
      relations: ['incomeDetails'],
    });
    if (!payrolls.length)
      throw new NotFoundException(`No payroll records found`);
    return payrolls;
  }
  async update(
    id: string,
    updatePayroll: UpdatePayrollSummaryDto,
    updateIncome: UpdateIncomeDetailsDto[],
  ): Promise<PayrollSummary> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let payroll = await queryRunner.manager.findOne(PayrollSummary, {
        where: { code: id },
        relations: ['incomeDetails'], // Ensure income details are loaded
      });

      if (!payroll) {
        throw new NotFoundException(`Payroll with ID ${id} not found`);
      }

      // Update Payroll Summary
      await queryRunner.manager.update(
        PayrollSummary,
        { code: id },
        updatePayroll,
      );

      if (updateIncome?.length > 0) {
        // Update existing or insert new income details
        const updatedIncomeDetails = updateIncome.map((income) => {
          if (!Object.values(IncomeType).includes(income.type as IncomeType)) {
            throw new BadRequestException(
              `Invalid income type: ${income.type}`,
            );
          }

          return this.incomeRepo.create({
            ...income,
            summary: payroll,
            type: income.type as IncomeType, // Ensure correct type casting
          });
        });

        await queryRunner.manager.save(updatedIncomeDetails);
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(
        `Failed to update payroll and income details: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payroll = await queryRunner.manager.findOne(PayrollSummary, {
        where: { code: id },
      });
      if (!payroll)
        throw new NotFoundException(`Payroll with ID ${id} not found`);

      await queryRunner.manager.delete(IncomeDetails, { summary: payroll });
      await queryRunner.manager.delete(PayrollSummary, { code: id });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to delete payroll: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
