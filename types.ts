export type SearchMode = 'DATA' | 'RESEARCH';

export interface SearchParams {
  mode: SearchMode;
  dataType: string; // Can be DataType or PaperType
  location: string;
  question: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  markdown: string;
  sources: Array<{
    title: string;
    uri: string;
  }>;
}

export enum DataType {
  VECTOR = 'Vector (Shapefile, GeoJSON)',
  RASTER = 'Raster (Imagery, DEM, Land Cover)',
  TABULAR = 'Tabular (CSV, Excel with Lat/Lon)',
  LIDAR = 'LiDAR / Point Cloud',
  DEMOGRAPHIC = 'Demographic / Census',
  LIVE_FEED = 'Live Feeds / IoT / WFS'
}

export enum PaperType {
  ALL = 'All Types',
  CASE_STUDY = 'Case Study / Application',
  METHODOLOGY = 'Methodology / Algorithm',
  REVIEW = 'Literature Review',
  TECHNICAL_REPORT = 'Technical Report',
  THESIS = 'Thesis / Dissertation'
}