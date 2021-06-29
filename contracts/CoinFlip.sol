// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract CoinFlip is ERC20 {
    constructor() ERC20("Coin Flip", "FLIP") {
        _mint(address(this), 10000000 * 10**decimals());
    }

    // Keeps track of the number of games created
    uint256 private _gameID;

    // Checks to make sure the player number given is 1 or 2
    modifier numCheck(uint256 _playerNum) {
        require(_playerNum == 1 || _playerNum == 2, "Number must be 1 or 2");
        _;
    }

    // Mapping from game's ID to the addresses of the players
    mapping(uint256 => address) private _player1;
    mapping(uint256 => address) private _player2;

    // Mapping from game ID to bet amount
    mapping(uint256 => uint256) private _betAmount;

    // Mapping from game ID to player that gets to flip coin
    mapping(uint256 => address) private _coinFlipper;

    function currentGameID() public returns (uint256) {
        return _gameID;
    }

    /**
     * @dev Let's users get ERC20 tokens to bet with.
     */
    function getTokens(uint256 _amount) public {
        require(_amount < totalSupply(), "Amount is more than total supply.");
        _transfer(address(this), msg.sender, _amount);
    }

    // Gets the player's address from the mapping
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

    // Creates a new game with the player initializing the amount
    // they want to bet.
    function createGame(uint256 _amount) public {
        require(
            _amount <= balanceOf(msg.sender) && _amount >= 2e12,
            "Not enough or too many tokens"
        );
        transfer(address(this), _amount);
        _player1[_gameID] = msg.sender;
        _betAmount[_gameID] = _amount;
        _gameID++;
    }

    // Allows a second player to bet in on a game.
    // A game must already exist without a 2nd player to join.
    // Will randomly select the coin flipper from the front end.
    function betTokens(
        uint256 _amount,
        uint256 _id,
        uint256 _random
    ) public numCheck(_random) {
        require(
            _amount <= balanceOf(msg.sender) && _amount >= 2e12,
            "Not enough or too many tokens"
        );
        require(_id < _gameID, "Game doesn't exist!");
        require(_player2[_id] == address(0), "2nd player already exists");
        require(_amount == _betAmount[_id], "Amount not equal to bet amount");
        transfer(address(this), _amount);
        _player2[_id] = msg.sender;
        setCoinFlipper(_id, _random);
    }

    // Needs work
    function startGame(uint256 _id, uint256 _random) public numCheck(_random) {
        require(msg.sender == _coinFlipper[_id], "You're not the coin flipper");
        if (_random == 1) {
            // Set winner
        } else {
            // Set loser
        }
    }

    // Sets the player that will get to flip the coin.
    function setCoinFlipper(uint256 _id, uint256 _random) private {
        if (_random == 1) {
            _coinFlipper[_id] = _player1[_id];
        } else {
            _coinFlipper[_id] = _player2[_id];
        }
    }

    // Let player put funds in for a game
    // Funds can be random, but must equal each other from both players
    // Store funds, address, and gameID
    // When another player deposits funds into gameID
    // Choose a random one of the 2 players to flip the coin
    // Store info of players winning and loses to be able
    // to withdraw their balance whenever they want
}
