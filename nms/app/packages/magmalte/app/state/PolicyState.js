/*
 * Copyright 2020 The Magma Authors.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @flow strict-local
 * @format
 */

import type {network_id, policy_id, policy_rule} from '@fbcnms/magma-api';

import MagmaV1API from '@fbcnms/magma-api/client/WebClient';

type Props = {
  networkId: network_id,
  policies: {[string]: policy_rule},
  setPolicies: ({[string]: policy_rule}) => void,
  key: policy_id,
  value?: policy_rule,
};

export async function SetPolicyState(props: Props) {
  const {networkId, policies, setPolicies, key, value} = props;
  if (value != null) {
    if (!(key in policies)) {
      await MagmaV1API.postNetworksByNetworkIdPoliciesRules({
        networkId: networkId,
        policyRule: value,
      });
    } else {
      await MagmaV1API.putNetworksByNetworkIdPoliciesRulesByRuleId({
        networkId: networkId,
        ruleId: key,
        policyRule: value,
      });
    }
    const policyRule = await MagmaV1API.getNetworksByNetworkIdPoliciesRulesByRuleId(
      {
        networkId: networkId,
        ruleId: key,
      },
    );

    if (policyRule) {
      const newPolicies = {...policies, [key]: policyRule};
      setPolicies(newPolicies);
    }
  } else {
    await MagmaV1API.deleteNetworksByNetworkIdPoliciesRulesByRuleId({
      networkId: networkId,
      ruleId: key,
    });
    const newPolicies = {...policies};
    delete newPolicies[key];
    setPolicies(newPolicies);
  }
}
