'use strict';

import faker from 'faker';
import { pCreateAccountMock, pRemoveAccountMock } from '../lib/account-mock';
import Tree from '../../model/tree';
import Account from '../../model/account';


const pCreateTreeMock = () => {
  const resultMock = {};
  return pCreateAccountMock()
    .then((mockAcctResponse) => {
      resultMock.accountMock = mockAcctResponse;

      return new Tree({
        title: faker.lorem.words(5),
        url: faker.random.image(),
        account: resultMock.accountMock.account._id,
      }).save();
    })
    .then((tree) => {
      resultMock.tree = tree;
      return resultMock;
    });
};


const pRemoveTreeMock = () => Promise.all([Account.remove({}), Tree.remove({})]);

export { pCreateTreeMock, pRemoveTreeMock };
