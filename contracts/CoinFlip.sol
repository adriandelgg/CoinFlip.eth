// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract CoinFlip is ERC20 {
    uint256 private _gameID;

    constructor() ERC20("Coin Flip", "FLIP") {
        _mint(address(this), 10000000 * 10**decimals());
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

    // Gets the player's address from the mapping
    function getPlayerAddress(uint256 _player, uint256 _id)
        public
        view
        returns (address)
    {
        require(_player == 1 || _player == 2, "Number must be 1 or 2");
        require(_id < _gameID, "Game doesn't exist");
        if (_player == 1) {
            return _player1[_id];
        } else {
            return _player2[_id];
        }
    }

    function setCoinFlipper(uint256 _id, uint256 _random) private {
        if (_random == 1) {
            _coinFlipper[_id] = _player1[_id];
        } else {
            _coinFlipper[_id] = _player2[_id];
        }
    }

    /**
     * @dev Let's users get ERC20 tokens to bet with.
     */
    function getTokens(uint256 _amount) public {
        require(_amount < totalSupply(), "Amount is more than total supply.");
        _transfer(address(this), msg.sender, _amount);
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

    function betTokens(
        uint256 _amount,
        uint256 _id,
        uint256 _random
    ) public {
        require(
            _amount <= balanceOf(msg.sender) && _amount >= 2e12,
            "Not enough or too many tokens"
        );
        require(_id < _gameID, "Game doesn't exist!");
        require(_random == 1 || _random == 2, "Random number must be 1 or 2");
        require(_player2[_id] == address(0), "2nd player already exists");
        require(_amount == _betAmount[_id], "Amount not equal to bet amount");
        transfer(address(this), _amount);
        _player2[_id] = msg.sender;
        setCoinFlipper(_id, _random);
    }

    // function startGame() public {
    //     require()
    // }

    // Let player put funds in for a game
    // Funds can be random, but must equal each other from both players
    // Store funds, address, and gameID
    // When another player deposits funds into gameID
    // Choose a random one of the 2 players to flip the coin
    // Store info of players winning and loses to be able
    // to withdraw their balance whenever they want
}
