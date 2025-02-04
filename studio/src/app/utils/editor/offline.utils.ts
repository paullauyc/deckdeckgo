import {SlideAttributes} from '../../models/data/slide';
import {DeckAttributes} from '../../models/data/deck';

import {FirestoreUtils} from './firestore.utils';

export class OfflineUtils {
  static async cleanAttributes(attributes: SlideAttributes | DeckAttributes): Promise<SlideAttributes | DeckAttributes> {
    if (!attributes || attributes === undefined) {
      return null;
    }

    const keys: string[] = Object.keys(attributes);

    if (!keys || keys.length <= 0) {
      return null;
    }

    return FirestoreUtils.filterDelete(attributes, true);
  }
}
