import {
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { instanceToPlain, Exclude } from "class-transformer";
import User from "../User.entity";

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

  @ManyToOne(() => User, (user) => user.solicitudesS)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @BeforeInsert()
  async setUsuarioCreacion() {
    this.usuarioCreacion = this.user.username;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
