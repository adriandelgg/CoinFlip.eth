// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoinFlip is ERC20 {
    constructor() ERC20("Coin Flip", "FLIP") {
        _mint(address(this), 10000000 * 10**decimals());
    }

    // Keeps track of the number of games created
    uint256 private _gameID;

    // Keeps track of currently active games
    uint256 private _totalOpenGames;

    // Mapping from game ID to the addresses of the players
    mapping(uint256 => address) private _player1;
    mapping(uint256 => address) private _player2;

    // Mapping from game ID to bet amount
    mapping(uint256 => uint256) private _betAmount;

    // Mapping from game ID to player that gets to flip coin
    mapping(uint256 => address) private _coinFlipper;

    // Struct for games that are ready to be played
    struct GameReady {
        address player1;
        address player2;
        address coinFlipper;
        uint256 betAmount;
        uint256 gameID;
    }

    // Mapping from game ID to games ready struct
    mapping(uint256 => GameReady) private _gamesReady;

    // Checks to make sure the number given is 1 or 2
    modifier numCheck(uint8 _playerNum) {
        require(_playerNum == 1 || _playerNum == 2, "Number must be 1 or 2");
        _;
    }

    // Returns the current game ID
    function getGameID() public view returns (uint256) {
        return _gameID;
    }

    // Returns total amount bet for X game
    function getAmountBet(uint256 _id) public view returns (uint256) {
        return _betAmount[_id];
    }

    // Returns who the coin flipper is for X game
    function getCoinFlipper(uint256 _id) public view returns (address) {
        return _coinFlipper[_id];
    }

    // Returns the players' address assigned to a game
    function getPlayerAddress(uint8 _player, uint256 _id)
        public
        view
        numCheck(_player)
        returns (address)
    {
        require(_id < _gameID, "Game doesn't exist");
        if (_player == 1) {
            return _player1[_id];
        } else {
            return _player2[_id];
        }
    }

    // Returns games ready struct from mapping
    function getGamesReady(uint256 _id) public view returns (GameReady memory) {
        return _gamesReady[_id];
    }

    /**
     * @dev Let's users get ERC20 tokens to bet with.
     */
    function getTokens(uint256 _amount) public {
        _transfer(address(this), msg.sender, _amount);
    }

    /**
     * @dev Creates a new game with the player initializing the amount.
     * Minimum amount must be more than 2e12 since the loser pays the gas fee.
     */
    function createGame(uint256 _amount) public {
        require(_amount > 2e12, "Amount must be more than 2e12");
        transfer(address(this), _amount);

        uint256 gameID = _gameID; // Gas saving trick
        _player1[gameID] = msg.sender;
        _betAmount[gameID] = _amount - 2e12;
        _gamesReady[gameID].player1 = msg.sender;
        _gamesReady[gameID].gameID = gameID;
        _gameID++;
    }

    /**
     * @dev Random number must be generated from the frontend to determine
     * the coin flipper.
     *
     * Allows a second player to bet in on a game.
     * A game must already exist without a 2nd player to join.
     */
    function betTokens(
        uint256 _amount,
        uint256 _id,
        uint8 _random
    ) public numCheck(_random) {
        require(
            _amount == _betAmount[_id] + 2e12,
            "Amount not equal to bet amount"
        );
        require(_id < _gameID, "Game doesn't exist");
        require(_player2[_id] == address(0), "2nd player already exists");
        transfer(address(this), _amount);
        _player2[_id] = msg.sender;
        _setCoinFlipper(_id, _random);
        _gamesReady[_id].player2 = msg.sender;
        _gamesReady[_id].betAmount = _amount - 2e12;
        _gamesReady[_id].coinFlipper = _coinFlipper[_id];
    }

    /**
     * Lets only the coin flipper start the game. Approves an allowance
     * to the winner player so that they can then withdraw it later.
     *
     * @dev Use transferFrom() to withdraw your earnings.
     */
    function startGame(uint256 _id, uint8 _random) public numCheck(_random) {
        address coinFlipper = _coinFlipper[_id];
        require(msg.sender == coinFlipper, "You're not the coin flipper");

        uint256 totalEarnings = _betAmount[_id] + 2e12;
        address player1 = _player1[_id];

        if (_random == 1) {
            _approve(address(this), coinFlipper, totalEarnings);
            delete _gamesReady[_id];
        } else {
            if (coinFlipper == player1) {
                _approve(address(this), _player2[_id], totalEarnings);
                delete _gamesReady[_id];
            } else {
                _approve(address(this), player1, totalEarnings);
                delete _gamesReady[_id];
            }
        }
    }

    /**
     * Sets the player that will get to flip the coin.
     *
     * @dev Is called by betTokens()
     */
    function _setCoinFlipper(uint256 _id, uint8 _random) private {
        if (_random == 1) {
            _coinFlipper[_id] = _player1[_id];
        } else {
            _coinFlipper[_id] = _player2[_id];
        }
    }
}
