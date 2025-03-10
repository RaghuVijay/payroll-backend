import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    default: () => "CONCAT('ORG', LPAD(nextval('org_seq')::text, 4, '0'))",
  })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address_1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address_2: string;

  @Column({ type: 'varchar', length: 20 })
  city: string;

  @Column({ type: 'varchar', length: 20 })
  country: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}