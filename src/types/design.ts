export interface DesignArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesignPosition extends DesignArea {
  rotation?: number;
  scale?: number;
}
