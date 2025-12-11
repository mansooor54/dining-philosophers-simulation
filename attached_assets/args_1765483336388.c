/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   args.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: malmarzo <malmarzo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/23 09:15:37 by malmarzo          #+#    #+#             */
/*   Updated: 2025/11/23 11:55:37 by malmarzo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/philo.h"

static int	is_valid_number(char *str)
{
	int		i;
	int		len;

	i = 0;
	len = 0;
	if (!str || !str[0])
		return (0);
	if (str[i] == '+')
		i++;
	if (!str[i])
		return (0);
	while (str[i])
	{
		if (!(str[i] >= '0' && str[i] <= '9'))
			return (0);
		i++;
		len++;
	}
	if (len > 10)
		return (0);
	return (1);
}

static int	print_error(char *str, int type)
{
	printf("Error: Invalid arguments\n");
	printf("philo: invalid input: %s: ", str);
	if (type == 2)
		printf("number of philosophers must be at least 1.\n");
	else
		printf("not a valid unsigned integer between 0 and 2147483647.\n");
	return (1);
}

static long	ft_atol(const char *str)
{
	int		i;
	long	res;

	i = 0;
	res = 0;
	if (str[i] == '+')
		i++;
	while (str[i] >= '0' && str[i] <= '9')
	{
		if (res > (2147483647 - (str[i] - '0')) / 10)
			return (-1);
		res = res * 10 + (str[i] - '0');
		i++;
	}
	return (res);
}

static int	validate_philo_count(char *str, long value)
{
	if (value == 0)
		return (print_error(str, 2));
	return (0);
}

int	check_args(int argc, char **argv)
{
	int		i;
	long	value;

	i = 1;
	while (i < argc)
	{
		if (argv[i][0] == '-' || !is_valid_number(argv[i]))
			return (print_error(argv[i], 0));
		value = ft_atol(argv[i]);
		if (value < 0 || value > 2147483647)
			return (print_error(argv[i], 0));
		if (i == 1 && value < 2)
			return (validate_philo_count(argv[i], value));
		if (i >= 2 && value == 0)
			return (print_error(argv[i], 0));
		i++;
	}
	return (0);
}
