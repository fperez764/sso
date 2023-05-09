import {
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from "typeorm";
import { instanceToPlain, Exclude } from "class-transformer";
import User from "../User.entity";

export default abstract class ABEModel extends BaseEntity {
  @Index()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @ManyToOne(() => User, { nullable: false , eager: true})
  @JoinColumn({ name: "usuarioCreacion", referencedColumnName: "username" })
  usuarioCreacion: User;

  @UpdateDateColumn()
  fechaModificacion: Date; //La baja quedara registrada con la ultima modificacion

  @DeleteDateColumn()
  fechaBaja: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "usuarioBaja", referencedColumnName: "username" })
  usuarioBaja: User;

  toJSON() {
    return instanceToPlain(this);
  }
}
