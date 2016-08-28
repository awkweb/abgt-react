var TrackCard = React.createClass({
  highlight: function(name, filterText) {
    var startIdx = name.toLowerCase().indexOf(filterText);
    var textNodes = <td>{name}</td>

    if(startIdx > -1 ) {
      textNodes = (
        <td>
          {name.substring(0, startIdx)}
          <span className="highlight">{name.substring(startIdx, startIdx + filterText.length)}</span>
          {name.substring(startIdx + filterText.length)}
        </td>
      )
    }

    return (
      textNodes
    );
  },

  render: function() {
    var name = this.highlight(this.props.track.name, this.props.filterText),
      artist = this.highlight(this.props.track.artist, this.props.filterText),
      show = this.highlight(this.props.track.show, this.props.filterText);

    return (
      <tr>
        {name}
        {artist}
        {show}
      </tr>
    );
  }
});

var TrackTable = React.createClass({
  render: function() {
    var rows = [],
      tracks = this.props.tracks,
      filterText = this.props.filterText.toLowerCase(),
      isRegular = this.props.isRegular,
      isRecordOfTheWeek = this.props.isRecordOfTheWeek,
      isPushTheButton = this.props.isPushTheButton,
      isFlashback = this.props.isFlashback;

    tracks.forEach(function(track, index) {
      var trackname = track.name.toLowerCase(),
          artist = track.artist.toLowerCase(),
          show = track.show.toLowerCase();
      if ((!trackname.includes(filterText) && !artist.includes(filterText) && !show.includes(filterText)) || 
          (track.type === "regular" && !isRegular) ||
          (track.type === "record_of_the_week" && !isRecordOfTheWeek) ||
          (track.type === "push_the_button" && !isPushTheButton) ||
          (track.type === "flashback" && !isFlashback)) {
        return;
      }
      rows.push(<TrackCard track={track} filterText={filterText} key={index + "_" + track.trackname} />);
    }.bind(this));
    return (
      <table className="track-table">
        <thead>
          <tr>
            <th>Track</th>
            <th>Artist</th>
            <th>Episode</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var SearchBar = React.createClass({
  handleKeyPress: function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  },

  handleChange: function(event) {
    this.props.onUserInput(
      this.refs.filterTextInput.value,
      this.refs.isRegular.checked,
      this.refs.isRecordOfTheWeek.checked,
      this.refs.isPushTheButton.checked,
      this.refs.isFlashback.checked
    );
  },

  render: function() {
    return (
      <header>
        <form>
          <input
            type="text"
            className="search"
            autoFocus="true"
            spellCheck="false"
            placeholder="Search tracks, artists, episodes..."
            value={this.props.filterText}
            ref="filterTextInput"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
          />
          <div className="types">
            <div>
              <input
                type="checkbox"
                checked={this.props.isRegular}
                ref="isRegular"
                onChange={this.handleChange}
              />
              <label>Regular</label>
            </div>

            <div>
              <input
                type="checkbox"
                checked={this.props.isRecordOfTheWeek}
                ref="isRecordOfTheWeek"
                onChange={this.handleChange}
              />
              <label>Record Of The Week</label>
            </div>

            <div>
              <input
                type="checkbox"
                checked={this.props.isPushTheButton}
                ref="isPushTheButton"
                onChange={this.handleChange}
              />
              <label>Push The Button</label>
            </div>

            <div>
              <input
                type="checkbox"
                checked={this.props.isFlashback}
                ref="isFlashback"
                onChange={this.handleChange}
              />
              <label>Flashback</label>
            </div>
          </div>
        </form>
      </header>
    );
  }
});

var FilterableTrackTable = React.createClass({
  loadTracksFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: "json",
      cache: false,
      success: function(data) {
        this.setState({tracks: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      tracks: [],
      filterText: '',
      isRegular: true,
      isPushTheButton: true,
      isRecordOfTheWeek: true,
      isFlashback: true
    };
  },

  componentDidMount: function() {
    this.loadTracksFromServer();
  },

  handleUserInput: function(filterText, isRegular, isRecordOfTheWeek, isPushTheButton, isFlashback) {
    this.setState({
      filterText: filterText,
      isRegular: isRegular,
      isRecordOfTheWeek: isRecordOfTheWeek,
      isPushTheButton: isPushTheButton,
      isFlashback: isFlashback
    });
  },

  render: function() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          isRegular={this.state.isRegular}
          isRecordOfTheWeek={this.state.isRecordOfTheWeek}
          isPushTheButton={this.state.isPushTheButton}
          isFlashback={this.state.isFlashback}
          onUserInput={this.handleUserInput}
        />
        <TrackTable
          tracks={this.state.tracks}
          filterText={this.state.filterText}
          isRegular={this.state.isRegular}
          isRecordOfTheWeek={this.state.isRecordOfTheWeek}
          isPushTheButton={this.state.isPushTheButton}
          isFlashback={this.state.isFlashback}
        />
      </div>
    );
  }
});
 
ReactDOM.render(
  <FilterableTrackTable url="/python/data/tracks.json" />,
  document.getElementById("container")
);
