type CRS = {
    type: string;
    properties: {
      name: string;
    };
  };
  
  export type Geometry = {
    crs: CRS;
    type: "Polygon";
    coordinates: number[][][]; 
  };
  
  type PointGeometry = {
    crs: CRS;
    type: "Point";
    coordinates: [number, number];
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

  export type PointType = {
    id: number;
    geometry: PointGeometry;
    name: string;
    properties: Properties;
    createdAt: string;
    updatedAt: string;
  };