import React from 'react';
import axios from 'axios';

import NamespaceInput from './NamespaceInput';
import PodList from './PodList';

class NamespacePods extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      namespace: null,
      namespaceInput: '',
      podNames: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNamespacedPods = this.getNamespacedPods.bind(this);
  }

  getNamespacedPods(namespace) {
    axios.get(`http://localhost:8080/api/v1/namespaces/${namespace}/pods`)
      .then((response) => {
        const { items } = response.data;
        const podNames = items.map(item => item.metadata.name);
        this.setState({
          podNames,
        });
      });
  }

  handleChange(event) {
    event.preventDefault();

    this.setState({
      namespaceInput: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { namespaceInput } = this.state;

    this.getNamespacedPods(namespaceInput);
    this.setState({
      namespace: namespaceInput,
    });
  }

  render() {
    const { namespace, namespaceInput, podNames } = this.state;

    if (podNames.length > 0) {
      return (
        <div className="kube-display">
          <NamespaceInput
            namespaceInput={namespaceInput}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
          />
          <h2>
            {`Pods in the '${namespace}' namespace`}
          </h2>
          <PodList podNames={podNames} />
        </div>
      );
    }
    return (
      <div className="kube-display">
        <NamespaceInput
          namespaceInput={namespaceInput}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default NamespacePods;
