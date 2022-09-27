import {
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
} from "typeorm";
import { instanceToPlain, Exclude } from "class-transformer";

export default abstract class ABEModel extends BaseEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @Column({ nullable: true, type: "text" })
  usuarioCreacion: string;

  @UpdateDateColumn()
  fechaModificacion: Date; //La baja quedara registrada con la ultima modificacion

  @Exclude()
  @Column({ nullable: true, type: "text" })
  usuarioBaja: string;

  toJSON() {
    return instanceToPlain(this);
  }
}
