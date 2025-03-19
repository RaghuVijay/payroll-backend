import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Features } from './features.entity';
import { UserRoles } from 'src/roles/roles.entity';

@Entity('rbac')
export class Rbac {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Features, (feature: Features) => feature.code)
  @JoinColumn({ name: 'feature_code', referencedColumnName: 'code' })
  feature: Features;

  @ManyToOne(() => UserRoles, (role: UserRoles) => role.code)
  @JoinColumn({ name: 'role_code', referencedColumnName: 'code' }) // Explicitly reference code
  role: UserRoles;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
