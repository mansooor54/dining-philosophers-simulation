/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: malmarzo <malmarzo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/23 09:15:37 by malmarzo          #+#    #+#             */
/*   Updated: 2025/11/23 11:55:37 by malmarzo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/philo.h"

int	init_data(t_data *data, int argc, char **argv)
{
	data->num_philos = ft_atoi(argv[1]);
	data->time_to_die = ft_atoi(argv[2]);
	data->time_to_eat = ft_atoi(argv[3]);
	data->time_to_sleep = ft_atoi(argv[4]);
	if (argc == 6)
		data->must_eat_count = ft_atoi(argv[5]);
	else
		data->must_eat_count = -1;
	data->dead_flag = 0;
	data->philos = NULL;
	data->forks = NULL;
	return (0);
}

static void	cleanup_mutexes(t_data *data, int forks_count, int flags)
{
	int	i;

	i = 0;
	while (i < forks_count)
	{
		pthread_mutex_destroy(&data->forks[i]);
		i++;
	}
	if (flags & 1)
		pthread_mutex_destroy(&data->write_lock);
	if (flags & 2)
		pthread_mutex_destroy(&data->meal_lock);
	if (flags & 4)
		pthread_mutex_destroy(&data->dead_lock);
	free(data->forks);
	data->forks = NULL;
}

int	init_mutexes(t_data *data)
{
	int	i;

	data->forks = malloc(sizeof(pthread_mutex_t) * data->num_philos);
	if (!data->forks)
		return (1);
	i = 0;
	while (i < data->num_philos)
	{
		if (pthread_mutex_init(&data->forks[i], NULL))
		{
			cleanup_mutexes(data, i, 0);
			return (1);
		}
		i++;
	}
	if (pthread_mutex_init(&data->write_lock, NULL))
		return (cleanup_mutexes(data, i, 0), 1);
	if (pthread_mutex_init(&data->meal_lock, NULL))
		return (cleanup_mutexes(data, i, 1), 1);
	if (pthread_mutex_init(&data->dead_lock, NULL))
		return (cleanup_mutexes(data, i, 3), 1);
	return (0);
}

static void	assign_forks(t_philo *philo, t_data *data, int i)
{
	if (i % 2 == 0)
	{
		philo->left_fork = &data->forks[i];
		philo->right_fork = &data->forks[(i + 1) % data->num_philos];
	}
	else
	{
		philo->left_fork = &data->forks[(i + 1) % data->num_philos];
		philo->right_fork = &data->forks[i];
	}
}

int	init_philos(t_data *data)
{
	int	i;

	data->philos = malloc(sizeof(t_philo) * data->num_philos);
	if (!data->philos)
		return (1);
	i = 0;
	while (i < data->num_philos)
	{
		data->philos[i].id = i + 1;
		data->philos[i].eat_count = 0;
		data->philos[i].last_meal_time = 0;
		data->philos[i].data = data;
		assign_forks(&data->philos[i], data, i);
		i++;
	}
	return (0);
}
