import { Entity, Column, Unique } from "typeorm";
import ABEModel from "./ABEModel/ABEModel";
import { Areas, Roles } from "./User.entity";

export enum Permisos {
  LEER = "R",
  ACTUALIZAR = "RU",
  CREAR = "CRU",
  ELIMINAR = "CRUD",
}
/**
 * Usuario tiene AREA Y ROL, según esta combinación, podran crearse diferentes niveles de permiso por dupla AREA-ROL
 * Los permisos seran progresivos, LEER -> LEER+EDITAR -> LEER+EDITAR+CREAR -> LEER+EDITAR+CREAR+ELIMINAR
 * Asumimos que si un usuario puede crear registros en las entidades tambien puede leerlas y editarlas...etc
 * En caso de necesitar mas niveles de permisos se pueden crear nuevos roles solo modificando el enum en la entidad User.entity.ts
 */
@Entity("user_permiso")
@Unique("UQ_AREA_ROL_ENTIDAD", ["area", "rol", "entidad"])
export default class Permiso extends ABEModel {
  constructor(permiso: Partial<Permiso>) {
    super();
    Object.assign(this, permiso);
  }
  @Column({
    type: "enum",
    enum: Areas,
    default: Areas.AUXILIAR,
  })
  area: Areas;

  @Column({ type: "enum", enum: Roles, default: Roles.FUNCIONARIO })
  rol: Roles;

  @Column({ type: "enum", enum: Permisos, default: Permisos.LEER })
  permiso: Roles;

  @Column({ type: "text" })
  entidad: string;
}
