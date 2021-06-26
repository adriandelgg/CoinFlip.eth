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

    function selectPlayer(uint256 _player) public {
        require(_player == 0 || _player == 1, "Number must be 0 or 1");
    }

    function createGame(uint256 _amount) public {
        require(
            _amount <= balanceOf(msg.sender) && _amount >= 2e12,
            "Not enough or too many tokens"
        );
        _player1[_gameID] = msg.sender;
    }

    function betTokens(uint256 _amount, uint256 _id) public {
        require(_id <= _gameID, "Game doesn't exist!");
        require(
            _amount <= balanceOf(msg.sender) && _amount >= 2e12,
            "Not enough or too many tokens"
        );
        require(_amount <= _betAmount[_id], "Amount not equal to bet amount");
        _player2[_id] = msg.sender;
    }

    function startGame() public {}

    // Let player put funds in for a game
    // Funds can be random, but must equal each other from both players
    // Store funds, address, and gameID
    // When another player deposits funds into gameID
    // Choose a random one of the 2 players to flip the coin
    // Store info of players winning and loses to be able
    // to withdraw their balance whenever they want
}
