import { MintOrderLineType } from 'helpers/types';

export interface IProps {
  title: string;
  orderLines: MintOrderLineType[] | null;
  owner: string | null;
}
