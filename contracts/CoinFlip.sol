// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoinFlip is ERC20 {
    constructor() ERC20("Coin Flip", "FLIP") {
        _mint(address(this), 10000000 * 10**decimals());
    }

    // Keeps track of the number of games created
    uint256 private _gameID;

    // Mapping from game's ID to the addresses of the players
    mapping(uint256 => address) private _player1;
    mapping(uint256 => address) private _player2;

    // Mapping from game ID to bet amount
    mapping(uint256 => uint256) private _betAmount;

    // Mapping from game ID to player that gets to flip coin
    mapping(uint256 => address) private _coinFlipper;

    // Checks to make sure the number given is 1 or 2
    modifier numCheck(uint256 _playerNum) {
        require(_playerNum == 1 || _playerNum == 2, "Number must be 1 or 2");
        _;
    }

    // Returns the current game ID
    function currentGameID() public view returns (uint256) {
        return _gameID;
    }

    // Gets the players' address from the mapping
    function getPlayerAddress(uint256 _player, uint256 _id)
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
        _player1[_gameID] = msg.sender;
        _betAmount[_gameID] = _amount - 2e12;
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
        uint256 _random
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
    }

    /**
     * @dev Use transferFrom() to withdraw your earnings.
     *
     * Lets only the coin flipper start the game. Approves an allowance
     * to the winner player so that they can then withdraw it later.
     */
    function startGame(uint256 _id, uint256 _random) public numCheck(_random) {
        address coinFlipper = _coinFlipper[_id];
        require(msg.sender == coinFlipper, "You're not the coin flipper");

        uint256 totalEarnings = _betAmount[_id] + 2e12;
        address player1 = _player1[_id];

        if (_random == 1) {
            _approve(address(this), coinFlipper, totalEarnings);
        } else {
            if (coinFlipper == player1) {
                _approve(address(this), _player2[_id], totalEarnings);
            } else {
                _approve(address(this), player1, totalEarnings);
            }
        }
    }

    /**
     * Sets the player that will get to flip the coin.
     * Is called by betTokens()
     */
    function _setCoinFlipper(uint256 _id, uint256 _random) private {
        if (_random == 1) {
            _coinFlipper[_id] = _player1[_id];
        } else {
            _coinFlipper[_id] = _player2[_id];
        }
    }
}
