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
      podObjects: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNamespacedPods = this.getNamespacedPods.bind(this);
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

  getNamespacedPods(namespace) {
    axios.get("http://localhost:8080/api/v1/namespaces/"+namespace+"/pods")
      .then((response) => {
        this.setState({
          podObjects: response.data.items,
        });
    });
  }

  render() {
    const {
      namespace,
      podObjects,
    } = this.state;

    if (podObjects) {
      return (
        <div className="kube-display">
          <NamespaceInput
            namespace={namespace}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
          />
          <h2>
            {`Pods in the '${namespace}' namespace`}
          </h2>
          <PodList podObjects={podObjects} />
        </div>
      );

    } else {
      return (
        <div className="kube-display">
          <NamespaceInput
            namespace={namespace}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
          />
        </div>
      );
    }
  }
}

export default NamespacePods;
