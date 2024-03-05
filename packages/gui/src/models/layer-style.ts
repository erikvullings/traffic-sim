import { UIForm, deepCopy } from 'mithril-ui-form';
import { AnyLayer } from 'mapbox-gl';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { uniqueId } from 'mithril-materialized';
import { defaultLayerStyle } from '../components/map';

export type LayerStyle<T extends Record<string, any>> = {
  id: string;
  name: string;
  /** Folder for icons */
  iconPath: string;
  /** Available icons, consisting of a friendly name and a relative path, e.g. full path is iconPath/src */
  icons: Array<[name: string, src: string]>;
  /** Map layers */
  layers?: Record<string, any>[];
  /** GUI form */
  ui?: UIForm<T>;
};

export type FeatureCollectionProps = {
  $loki?: number;
  /** Session ID of the last user that edited it */
  lastEditedBy: string;
  /** Identifier of the source layer: layers with identical ID are overwritten */
  layerId: string;
  /** Name of the source layer: may be used in legend */
  layerName: string;
  /** Layer style ID, determines visual appearance of map layer */
  layerStyle: string;
  /** Allow others to edit the layer */
  layerShared: boolean;
  /** Allow others to delete the layer, @default false */
  layerCanDelete: boolean;
  /** Layer description */
  layerDesc: string;
};

/** Extended feature collection, with several additional properties */
export interface FeatureCollectionExt<G extends Geometry | null = Geometry, P = GeoJsonProperties>
  extends FeatureCollection<G, P> {
  $loki?: number;
  /** Session ID of the last user that edited it */
  lastEditedBy?: string;
  /** Identifier of the source layer: layers with identical ID are overwritten */
  layerId?: string;
  /** Name of the source layer: may be used in legend */
  layerName?: string;
  /** Layer style name, determines visual appearance of map layer */
  layerStyle?: string;
  /** Allow others to edit the layer */
  layerShared?: boolean;
  /** Allow others to delete the layer, @default false */
  layerCanDelete?: boolean;
  /** Layer description */
  layerDesc?: string;
}

export interface ILayer {
  // layerName: string;
  showLayer: boolean;
  type: AnyLayer;
  // layout?: Partial<SymbolLayoutProps>;
  // paint?: LinePaintProps | Record<string, any>;
  // filter?: any[];
}

export const layerStyleToLayers = (layerStyle: LayerStyle<any>): ILayer[] => {
  const { layers = [] } = layerStyle;
  return deepCopy(layers) as ILayer[];
};

export const enum SourceType {
  'realtime',
  'grid',
  'custom',
  'alert',
  'chemical_incident',
  'plume',
}

export interface ISource {
  id: string;
  source: FeatureCollectionExt;
  sourceName: string;
  dts?: Array<number>;
  sourceCategory: SourceType;
  layers: ILayer[];
  shared: boolean;
  shareWith?: string[];
  canDelete?: boolean;
  ui: UIForm<Record<string, any>>;
}

export const newSource = (sourceName: string, layerStyle: LayerStyle<any>) => {
  const id = uniqueId();
  return {
    id,
    sourceName,
    sourceCategory: SourceType.realtime,
    layers: layerStyleToLayers(layerStyle),
    ui: deepCopy(layerStyle.ui || ([] as UIForm<Record<string, any>>)),
    shared: true,
    canDelete: true,
    source: {
      layerId: id,
      layerName: sourceName,
      layerStyle: layerStyle.id || defaultLayerStyle.id,
      layerShared: true,
      layerCanDelete: true,
      type: 'FeatureCollection',
      features: [],
    } as FeatureCollectionExt,
  } as ISource;
};
