import {
  Column,
  Entity,
} from "typeorm";
import Persona from "../ABEModel/Persona";

@Entity("instalador")
export default class Instalador extends Persona {
  constructor(instalador: Partial<Instalador>) {
    super(instalador);
    Object.assign(this, instalador);
  }

  @Column()
  zona: string;
}
