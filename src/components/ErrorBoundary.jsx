import React from 'react';

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('[AppErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-white" translate="no">
          Ocorreu um erro ao renderizar esta tela. Tente recarregar.
        </div>
      );
    }

    return <div translate="no">{this.props.children}</div>;
  }
}
