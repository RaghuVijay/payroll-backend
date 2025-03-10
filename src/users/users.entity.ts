import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserCreds } from 'src/auth/auth.entity'; // Ensure the import path is correct
import { Gender } from './enums/gender.enum'; // Ensure the import path is correct

@Entity('user_info')
export class UserInfo {
  @PrimaryGeneratedColumn('uuid') // Primary key as UUID
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true, // Ensure the column is unique
    default: () => "CONCAT('USER', LPAD(nextval('user_seq')::text, 4, '0'))", // Default value for code
  })
  code: string;

  // Define a OneToOne relationship with UserCreds (Cascade Delete)
  @OneToOne(() => UserCreds, (userCreds) => userCreds.userInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cred_code', referencedColumnName: 'code' })
  cred: UserCreds;

  @Column({ type: 'varchar', length: 255 }) // Name column
  name: string;

  @Column({ type: 'varchar', length: 255 }) // Surname column
  surname: string;

  @Column({ type: 'date' }) // Date of birth column
  dob: Date;

  @Column({ type: 'enum', enum: Gender }) // Gender column as an enum
  gender: Gender;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
