import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('features')
@Unique(['code'])
export class Features {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    default: () => "CONCAT('FEAT', LPAD(nextval('feat_seq')::text, 4, '0'))",
  })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
