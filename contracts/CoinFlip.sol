// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Ethereum CoinFlipping Multiplayer Betting Game
 * @author Adrian Delgado - https://github.com/adriandelgg
 * @dev Use transferFrom() to withdraw your earnings.
 * Best if used with Hardhat local network, but the easiest
 * way to try it is by using the Rinkeby test net.
 */

contract CoinFlip is ERC20 {
    constructor() ERC20("Coin Flip", "FLIP") {
        _mint(address(this), 10000000 * 10**decimals());
    }

    // Keeps track of the number of games created
    uint256 private _gameID;

    // Struct holding all the information about a game
    struct Games {
        address player1;
        address player2;
        address coinFlipper;
        uint256 betAmount;
        uint256 gameID;
    }

    // Mapping from game ID to Games struct
    mapping(uint256 => Games) private _games;

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
        return _games[_id].betAmount;
    }

    // Returns who the coin flipper is for X game
    function getCoinFlipper(uint256 _id) public view returns (address) {
        return _games[_id].coinFlipper;
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
            return _games[_id].player1;
        } else {
            return _games[_id].player2;
        }
    }

    // Returns Games struct from mapping
    function getGames(uint256 _id) public view returns (Games memory) {
        return _games[_id];
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

        Games storage game = _games[_gameID];
        game.player1 = msg.sender;
        game.betAmount = _amount - 2e12;
        game.gameID = _gameID;
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
        Games storage game = _games[_id];
        require(
            _amount == game.betAmount + 2e12,
            "Amount not equal to bet amount"
        );
        require(_id < _gameID, "Game doesn't exist");
        require(game.player2 == address(0), "2nd player already exists");
        require(game.player1 != msg.sender, "You can't play against yourself.");

        game.player2 = msg.sender;
        transfer(address(this), _amount);
        _setCoinFlipper(_id, _random);
    }

    /**
     * Lets only the coin flipper start the game. Approves an allowance
     * to the winner player so that they can then withdraw it later.
     *
     * @dev Use transferFrom() to withdraw your earnings.
     */
    function startGame(uint256 _id, uint8 _random) public numCheck(_random) {
        Games storage game = _games[_id];
        require(msg.sender == game.coinFlipper, "You're not the coin flipper");
        require(
            game.player2 != address(0) && game.betAmount != 0,
            "2nd player does not exist"
        );

        if (_random == 1) {
            _approve(
                address(this),
                game.coinFlipper,
                game.betAmount * 2 + 2e12
            );
        } else {
            if (game.coinFlipper == game.player1) {
                _approve(
                    address(this),
                    game.player2,
                    game.betAmount * 2 + 2e12
                );
            } else {
                _approve(
                    address(this),
                    game.player1,
                    game.betAmount * 2 + 2e12
                );
            }
        }
        delete _games[_id];
    }

    /**
     * Sets the player that will get to flip the coin.
     *
     * @dev Is called by betTokens()
     */
    function _setCoinFlipper(uint256 _id, uint8 _random) private {
        Games storage game = _games[_id];
        if (_random == 1) {
            game.coinFlipper = game.player1;
        } else {
            game.coinFlipper = game.player2;
        }
    }
}
