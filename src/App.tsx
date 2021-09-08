import React from 'react';
import './App.css';
import { RootState } from './redux';
import { fetchPdfFromBackend } from './redux/modules/pdf';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Document, Page } from 'react-pdf';

const mapStateToProps = (state: RootState) => ({
  pdf: state.pdf.content
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      fetchPdfFromBackend,
    },
    dispatch
  )
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const App: React.FC<Props> = props => {
  const [name, setName] = React.useState('');
  const [pageNumber, setPageNumber] = React.useState(0);
  const [status, setStats] = React.useState("NOT_DOWNLOADED");

  const updateName = (n: any) => setName(n.target.value);
  const fetchSomething = (event: any) => {
    event.preventDefault();
    if (name) {
      setStats("PREVIEW");
      props.fetchPdfFromBackend(name, "Osloveien 3", "0505 Oslo");
    }
  }

  const download = (event: any) => {
    event.preventDefault();
    if (name) {
      setStats("DOWNLOAD");
      props.fetchPdfFromBackend(name, "Osloveien 3", "0505 Oslo");
    }
  }

  function downloadPDF(b64: string) {
    const linkSource = `data:application/pdf;base64,${b64}`;
    const downloadLink = document.createElement("a");
    const fileName = "vedtaksdokument.pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  const onLoadSuccess = (pdf: any) => setPageNumber(pdf.numPages);

  if (props.pdf && status === 'DOWNLOAD') {
    downloadPDF(props.pdf);
  }

  return (
    <div className="App">
      <input placeholder="Name (metadata)" type="text" onBlur={updateName} />
      <button onClick={fetchSomething}>Preview PDF</button>
      <button onClick={download}>Download</button>
      {props.pdf && status === 'PREVIEW' &&
        <Document file={`data:application/pdf;base64,${props.pdf}`} onLoadSuccess={onLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>}
    </div>
  );
}

export const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
