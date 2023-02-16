import {
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { instanceToPlain, Exclude } from "class-transformer";
import User from "../User.entity";

export default abstract class ABEModel extends BaseEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "usuarioCreacion", referencedColumnName: "username" })
  usuarioCreacion: User;

  @UpdateDateColumn()
  fechaModificacion: Date; //La baja quedara registrada con la ultima modificacion

  @ManyToOne(() => User)
  @JoinColumn({ name: "usuarioBaja", referencedColumnName: "username" })
  usuarioBaja: User;

  toJSON() {
    return instanceToPlain(this);
  }
}
