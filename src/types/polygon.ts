type CRS = {
    type: string;
    properties: {
      name: string;
    };
  };
  
  export type Geometry = {
    crs: CRS;
    type: "Polygon";
    coordinates: number[][][]; // Representa as coordenadas do polígono
  };
  
  type PointGeometry = {
    crs: CRS;
    type: "Point";
    coordinates: [number, number]; // Representa as coordenadas do ponto central
  };
  
  type Properties = {
    name: string;
    description: string;
  };
  
  export type PolygonType = {
    id: number;
    geometry: Geometry;
    name: string;
    properties: Properties;
    centroid: PointGeometry;
    area_hectares: number;
    createdAt: string;
    updatedAt: string;
  };